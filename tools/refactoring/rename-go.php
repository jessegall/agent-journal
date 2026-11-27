<?php

declare(strict_types=1);

/**
 * Renames Go names with gopls, the Go team's renamer, started once as a language server for the whole list: it loads
 * the module once, answers every rename on that one load, and each file is written once with all its edits. An
 * interface's method renames its implementations with it.
 *
 *   php tools/refactoring/rename-go.php --list=<file> [--dry-run]   lines "<file>:<line>:<column> <new name>",
 *                                                                    paths and columns as in the module folder
 */
const MODULE = 'programs/runner';

$options = getopt('', ['list:', 'dry-run']);
$root = dirname(__DIR__, 2);
$module = "{$root}/".MODULE;
$renames = listedGoRenames((string) ($options['list'] ?? ''));
echo 'Loading the module with gopls for '.count($renames)." renames\n";
$server = GoplsServer::start($module);
$editsByFile = [];
$refused = 0;

foreach ($renames as [$file, $line, $column, $newName]) {
    $answer = $server->rename("{$module}/{$file}", $line - 1, $column - 1, $newName);

    if (isset($answer['error'])) {
        $refused++;
        fwrite(STDERR, "Refused {$file}:{$line}:{$column} {$newName}: {$answer['error']['message']}\n");

        continue;
    }

    foreach (textEditsOf($answer['result'] ?? []) as $path => $edits) {
        $editsByFile[$path] = [
            ...$editsByFile[$path] ?? [],
            ...$edits,
        ];
    }

    echo "Renamed {$file}:{$line}:{$column} to {$newName}\n";
}

$server->stop();

if (! array_key_exists('dry-run', $options)) {
    foreach ($editsByFile as $path => $edits) {
        file_put_contents($path, editedText((string) file_get_contents($path), $edits));
    }
}

exit($refused > 0 ? 1 : 0);

/**
 * One gopls language server spoken to over its standard input and output.
 */
final class GoplsServer
{
    private const int VIEW_ATTEMPTS = 60;

    private const int VIEW_WAIT_MICROSECONDS = 500_000;

    private int $nextId = 1;

    /** @var array<string, true> */
    private array $opened = [];

    /**
     * @param  resource  $process
     * @param  array<int, resource>  $pipes
     */
    private function __construct(private $process, private array $pipes) {}

    public static function start(string $module): self
    {
        static $isStarted = false;

        // The module is loaded once per run; a second server would load it again.
        if ($isStarted) {
            throw new LogicException('gopls would be started a second time; a run asks every rename of the one load.');
        }

        $isStarted = true;
        $gopls = trim((string) shell_exec('command -v gopls')) ?: getenv('HOME').'/go/bin/gopls';
        $process = proc_open([$gopls, 'serve'], [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['file', '/dev/null', 'a'],
        ], $pipes, $module);
        $server = new self($process, $pipes);
        $server->request('initialize', [
            'processId' => getmypid(),
            'rootUri' => "file://{$module}",
            'workspaceFolders' => [['uri' => "file://{$module}", 'name' => basename($module)]],
            'capabilities' => ['workspace' => ['workspaceEdit' => ['documentChanges' => true]]],
        ]);
        $server->notify('initialized', new stdClass());

        return $server;
    }

    /**
     * @return array<string, mixed>
     */
    public function rename(string $file, int $line, int $character, string $newName): array
    {
        $this->open($file);
        $params = [
            'textDocument' => ['uri' => "file://{$file}"],
            'position' => ['line' => $line, 'character' => $character],
            'newName' => $newName,
        ];

        // The server builds its view of the module after it starts, while answering its own configuration requests.
        for ($attempt = 1; ; $attempt++) {
            $answer = $this->request('textDocument/rename', $params);

            if (($answer['error']['message'] ?? '') !== 'no views' || $attempt === self::VIEW_ATTEMPTS) {
                return $answer;
            }

            usleep(self::VIEW_WAIT_MICROSECONDS);
        }
    }

    /**
     * Tells the server a file is open, once per file, which gives it the view the file belongs to.
     */
    private function open(string $file): void
    {
        if (isset($this->opened[$file])) {
            return;
        }

        $this->opened[$file] = true;
        $this->notify('textDocument/didOpen', ['textDocument' => [
            'uri' => "file://{$file}",
            'languageId' => 'go',
            'version' => 1,
            'text' => (string) file_get_contents($file),
        ]]);
    }

    public function stop(): void
    {
        $this->request('shutdown', null);
        $this->notify('exit', null);
        proc_close($this->process);
    }

    /**
     * @return array<string, mixed>
     */
    private function request(string $method, mixed $params): array
    {
        $id = $this->nextId++;
        $this->send(['jsonrpc' => '2.0', 'id' => $id, 'method' => $method, 'params' => $params]);

        while (true) {
            $message = $this->receive();

            if (($message['id'] ?? null) === $id && ! isset($message['method'])) {
                return $message;
            }

            // A request from the server is answered with defaults: an empty setting for each configuration item asked.
            if (isset($message['id'], $message['method'])) {
                $items = $message['params']['items'] ?? null;
                $result = is_array($items) ? array_fill(0, count($items), new stdClass()) : null;
                $this->send(['jsonrpc' => '2.0', 'id' => $message['id'], 'result' => $result]);
            }
        }
    }

    private function notify(string $method, mixed $params): void
    {
        $this->send(['jsonrpc' => '2.0', 'method' => $method, 'params' => $params]);
    }

    /**
     * @param  array<string, mixed>  $message
     */
    private function send(array $message): void
    {
        $body = json_encode($message, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
        fwrite($this->pipes[0], 'Content-Length: '.strlen($body)."\r\n\r\n".$body);
    }

    /**
     * @return array<string, mixed>
     */
    private function receive(): array
    {
        $length = 0;

        while (($header = fgets($this->pipes[1])) !== false && trim($header) !== '') {
            if (stripos($header, 'Content-Length:') === 0) {
                $length = (int) trim(substr($header, strlen('Content-Length:')));
            }
        }

        $body = '';

        while (strlen($body) < $length && ! feof($this->pipes[1])) {
            $body .= fread($this->pipes[1], $length - strlen($body));
        }

        $message = json_decode($body, true, flags: JSON_THROW_ON_ERROR);

        if (getenv('RENAME_GO_TRACE') !== false) {
            fwrite(STDERR, substr($body, 0, 300)."\n");
        }

        return $message;
    }
}

/**
 * @return list<array{string, int, int, string}>
 */
function listedGoRenames(string $file): array
{
    $renames = [];

    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        [$place, $newName] = preg_split('/\s+/', trim($line)) + [1 => ''];
        [$path, $row, $column] = explode(':', $place) + [
            1 => '0',
            2 => '0',
        ];
        $renames[] = [
            $path,
            (int) $row,
            (int) $column,
            $newName,
        ];
    }

    return $renames;
}

/**
 * The text edits of a workspace edit, by the file's path.
 *
 * @param  array<string, mixed>  $workspaceEdit
 * @return array<string, list<array{range: array<string, mixed>, newText: string}>>
 */
function textEditsOf(array $workspaceEdit): array
{
    $edits = [];

    foreach ($workspaceEdit['documentChanges'] ?? [] as $change) {
        $edits[substr($change['textDocument']['uri'], strlen('file://'))] = $change['edits'];
    }

    foreach ($workspaceEdit['changes'] ?? [] as $uri => $changes) {
        $edits[substr($uri, strlen('file://'))] = $changes;
    }

    return $edits;
}

/**
 * The text with the edits made, last first so the earlier places still hold; an edit made by two renames (an
 * interface's method and its implementation) is made once.
 *
 * @param  list<array{range: array<string, mixed>, newText: string}>  $edits
 */
function editedText(string $text, array $edits): string
{
    $lines = explode("\n", $text);
    $byOffset = [];

    foreach ($edits as $edit) {
        $start = offsetOf($lines, $edit['range']['start']);
        $byOffset[$start] = [
            $start,
            offsetOf($lines, $edit['range']['end']),
            $edit['newText'],
        ];
    }

    krsort($byOffset);

    foreach ($byOffset as [$start, $end, $newText]) {
        $text = substr($text, 0, $start).$newText.substr($text, $end);
    }

    return $text;
}

/**
 * The byte offset of a position, whose character counts UTF-16 units as the language server protocol does.
 *
 * @param  list<string>  $lines
 * @param  array{line: int, character: int}  $position
 */
function offsetOf(array $lines, array $position): int
{
    $before = array_sum(array_map(fn (string $line) => strlen($line) + 1, array_slice($lines, 0, $position['line'])));
    $utf16 = mb_convert_encoding($lines[$position['line']] ?? '', 'UTF-16LE', 'UTF-8');
    $prefix = mb_convert_encoding(substr($utf16, 0, $position['character'] * 2), 'UTF-8', 'UTF-16LE');

    return $before + strlen($prefix);
}
