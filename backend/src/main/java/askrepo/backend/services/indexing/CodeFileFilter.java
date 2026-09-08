package askrepo.backend.services.indexing;

import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Set;

@Component
public class CodeFileFilter {

    private static final Set<String> SKIP_DIR_PAIRS = Set.of(
            "node_modules",
            ".git",
            "dist",
            "build",
            "target",
            ".next",
            "vendor",
            "__pycache__",
            ".idea",
            ".vscode",
            "coverage",
            "out"

    );
    private static final Set<String> ALLOWED_EXTENSIONS=Set.of(
            "java","kt","kts","scala",
            "js","jsx","ts","tsx","mjs","cjs",
            "py","pyi",
            "go",
            "rb",
            "php",
            "c","h","cc","cpp","cxx","hpp","hxx",
            "cs",
            "swift",
            "rs",
            "sql",
            "sh","bash","ps1",
            "html","css","scss","less",
            "json","yaml","yml","xml","toml",
            "md",
            "gradle","properties"
    );

    private static final Set<String> SKIP_FILENAMES=Set.of(
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            "composer.lock",
            "cargo.lock",
            "poetry.lock"
    );

    public boolean isEligible(String path,long sizeBytes,long maxFileBytes){
        if(path==null || path.isBlank()){
            return false;
        }
        String normalized=path.replace('\\','/');
        String lower=normalized.toLowerCase(Locale.ROOT);

        for(String part:lower.split("/")){
            if(SKIP_DIR_PAIRS.contains(part)){
                return false;
            }
        }

        String filename=lower.substring(lower.lastIndexOf('/')+1);
        if(SKIP_FILENAMES.contains(filename)){
            return false;
        }
        if(filename.startsWith(".")){
            return false;

        }
        if(sizeBytes>maxFileBytes){
            return false;
        }
        if("dockerfile".equals(filename)||"makefile".equals(filename)){
            return true;
        }
        int dot=filename.lastIndexOf('.');
        if(dot<0){
            return false;
        }
        String ext=filename.substring(dot+1);
        return ALLOWED_EXTENSIONS.contains(ext);
    }

    public String detectLanguage(String path){
        String lower=path.toLowerCase(Locale.ROOT);
        String fileName=lower.substring(lower.lastIndexOf('/')+1);

        if("dockerfile".equals(fileName)){
            return "dockerfile";
        }
        if("makefile".equals(fileName)){
            return "makefile";
        }
        int dot=fileName.lastIndexOf('.');
        if(dot<0){
            return "text";
        }
        return fileName.substring(dot+1);
    }


}

