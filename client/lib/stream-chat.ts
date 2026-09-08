import {getApiBaseUrl,ApiError, type ChatMessage} from "@/lib/api";

export type StreamChatHandler={
    onUserMessage?:(message: ChatMessage)=>void;
    onToken?: (token: string) => void;
    onAssistantMessage?:(message: ChatMessage)=>void;
    onDone?:(message: ChatMessage)=>void;
    onError?:(error: ApiError)=>void;
    signal?:AbortSignal;
}

export async function streamChatMessage(
    session:string,
    content: string,
    handler: StreamChatHandler={}
):Promise<void> {
    const res=await fetch(`${getApiBaseUrl()}/api/chat/sessions/${session}/messages`,{
        method:"POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({content}),
        signal: handler.signal
    });
    if (!res.ok) {
        let message=res.statusText;
        try{
            const data=await res.json();
            message=data.message?? data.error ?? message;
        }catch(e){
            message=e instanceof Error? e.message: String(e);
        }
        throw new ApiError(res.status,message);
    }

    const reader=res.body?.getReader();
    const decoder=new TextDecoder();
    let buffer="";

    while (true) {
        const {done,value}=await reader?.read();
        if (done) break;
        buffer+=decoder.decode(value,{stream:true});
        const parts=buffer.split("\n\n");
        buffer=parts.pop()??"";

        for(const part of parts){
            if(!part.trim()) continue;

            const lines=part.split("\n");
            let event="message";
            const dataLines: string[] = [];
            for (const line of lines) {
                if (line.startsWith("event:")) {
                    event = line.slice(6).trim();
                } else if (line.startsWith("data:")) {
                    dataLines.push(line.slice(5).trimStart());
                }
            }
        const data = dataLines.join("\n");
        if(!data) continue;

        try{
            if(event=="token"){
                handler.onToken?.(JSON.parse(data)as string);
            }else if(event=="user_message"){
                handler.onUserMessage?.(JSON.parse(data) as ChatMessage);
            }else if(event=="assistant_message"){
                handler.onAssistantMessage?.(JSON.parse(data) as ChatMessage);
            }else if(event=="error"){
                handler.onError?.(new ApiError(0, JSON.parse(data) as string));
            }else if(event=="done"){
                handler.onDone?.();
            }
        }
        catch(e){
            e instanceof Error ? e.message : String(e);
        }
        }

      

    }
    
  handler.onDone?.();
}

