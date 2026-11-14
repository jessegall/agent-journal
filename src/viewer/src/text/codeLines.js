const CLOSER = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/;
const OPERATOR = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/;
const CALL = /[\w\]]\(/;
const ASSIGNMENT = /^[\w$.[\]'"]+\s*=\s*[^=]/;
const KEYWORD_LINE = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/;
const DIRECTIVE = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/;
const PREPROCESSOR = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/;
const OPENER = /[[({,]$/;
const KEY_LINE = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/;
const INDENTED = /^(\t|\s{2,})\S/;
const COMMENT = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/;
const INLINE_CODE = /`[^`]+`/;
const WORD = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/;
const SYMBOLS = /[{}()[\];=<>$&|*\\@+^~%]/g;
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s/;
const QUOTE = /^\s*>/;
const TABLE = /^\s*\|/;
const CODE_SHARE = 0.6;
const PROSE_SHARE = 0.4;
const PROSE_WORDS = 5;
const PROSE_SYMBOL_SHARE = 0.03;

const isPlain = (line) => {
    const words = line.trim().split(/\s+/);
    return words.length >= PROSE_WORDS && words.every((word) => WORD.test(word) || /^[\w'’-]+$/.test(word)) && (line.match(SYMBOLS) ?? []).length / line.length < PROSE_SYMBOL_SHARE;
};

const isCodey = (line) => {
    const text = line.trim();
    if (INLINE_CODE.test(text)) return false;
    return [CLOSER, OPERATOR, CALL, ASSIGNMENT, KEYWORD_LINE, DIRECTIVE, PREPROCESSOR, OPENER, KEY_LINE].some((pattern) => pattern.test(text)) || /[;{}]$/.test(text) || (INDENTED.test(line) && !LIST_ITEM.test(line) && !isPlain(line));
};

// what one paragraph is: "code" when most of its lines carry the marks of code and few read as a sentence, "line" when it is one
// line of code or one comment line, which only counts beside code, and "text" otherwise
export function typeOfParagraph(lines) {
    const filled = lines.filter((line) => line.trim());
    if (!filled.length || LIST_ITEM.test(filled[0]) || filled.every((line) => QUOTE.test(line) || TABLE.test(line))) return "text";
    const counted = filled.filter((line) => !COMMENT.test(line.trim()));
    if (filled.length === 1) return !counted.length || isCodey(filled[0]) ? "line" : "text";
    if (!counted.length) return "line";
    const codey = counted.filter(isCodey).length;
    const plain = counted.filter((line) => !isCodey(line) && isPlain(line)).length;
    return codey >= counted.length * CODE_SHARE && plain <= counted.length * PROSE_SHARE ? "code" : "text";
}
