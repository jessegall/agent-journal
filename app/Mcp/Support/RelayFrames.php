<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\AgentRequests\Support\AgentCallReply;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Http\Middleware\Mcp\LimitMcpMessage;
use Carbon\CarbonImmutable;

/**
 * The relay's side of a launched program's stdio: newline-delimited UTF-8 frames read without buffering past what
 * arrived, admitted with their arrival time into a queue of at most eight, and the journal's answers written back
 * one line each. A frame refused here never reaches the journal; diagnostics go to stderr, never stdout.
 */
final class RelayFrames
{
    public const int MOST_QUEUED = 8;

    private const int CHUNK_BYTES = 65536;

    private const int PARSE_ERROR = -32700;

    private const int INVALID_REQUEST = -32600;

    private const int SERVER_ERROR = -32000;

    private const int JSON_FLAGS = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR;

    private string $buffer = '';

    /**
     * @var list<Frame>
     */
    private array $queue = [];

    private bool $ended = false;

    private string|null $negotiatedVersion = null;

    /**
     * @param  resource  $input
     * @param  resource  $output
     * @param  resource  $errors
     */
    public function __construct(private $input, private $output, private $errors) {}

    public static function standard(): self
    {
        return new self(STDIN, STDOUT, STDERR);
    }

    /**
     * The next queued frame that may still start, waiting for input when none is queued; null once input ended.
     * Frames that arrived during the last call are admitted first, so a cancellation can drop its queued request.
     */
    public function next(): Frame|null
    {
        $this->admit(false);

        while (true) {
            while ($this->queue !== []) {
                $frame = array_shift($this->queue);

                if ($frame->canStartAt(CarbonImmutable::now())) {
                    return $frame;
                }

                $this->refuse(
                    $frame,
                    RefusalCode::DeadlineExpired,
                    'The call waited past its deadline and was not sent; send it again.',
                );
            }

            if ($this->ended) {
                return null;
            }

            $this->admit(true);
        }
    }

    /**
     * The MCP headers of the frame's call, with the version a legacy initialize negotiated.
     *
     * @return array<string, string>
     */
    public function mcpHeaders(Frame $frame): array
    {
        return $frame->mcpHeaders($this->negotiatedVersion);
    }

    /**
     * Writes the journal's answer to the frame: its body as one line, nothing for 202, and a JSON-RPC error for a
     * refusal that carries none of its own.
     */
    public function answer(Frame $frame, AgentCallReply $reply): void
    {
        if ($reply->status === 202) {
            return;
        }

        $body = json_decode($reply->body, true);

        if (is_array($body) && ($body['jsonrpc'] ?? null) === '2.0') {
            $this->rememberNegotiatedVersion($frame, $body);
            $this->write(json_encode($body, self::JSON_FLAGS));

            return;
        }

        match (true) {
            $reply->status === 401 => $this->refuse(
                $frame,
                RefusalCode::Unauthenticated,
                'The journal did not accept this launch credential.',
            ),
            $reply->status === 429 => $this->refuse(
                $frame,
                RefusalCode::Busy,
                'Too many calls; send it again after the wait.',
                ['retry_after_seconds' => is_array($body) ? ($body['retry_after_seconds'] ?? null) : null],
            ),
            $reply->status === 413, $reply->status === 400 => $this->refuse(
                $frame,
                RefusalCode::InvalidInput,
                'The journal refused the message as too large or malformed.',
            ),
            default => $this->refuse(
                $frame,
                RefusalCode::Unavailable,
                'The journal could not answer; send it again shortly.',
            ),
        };
    }

    /**
     * Answers a frame the journal never got, with the code of the failure.
     *
     * @param  CodedRefusal&\Throwable  $failure
     */
    public function fail(Frame $frame, CodedRefusal $failure): void
    {
        $this->refuse($frame, $failure->refusalCode(), $failure->getMessage());
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function refuse(Frame $frame, RefusalCode $code, string $message, array $data = []): void
    {
        if (! $frame->isRequest()) {
            $this->diagnose("A {$frame->method()} message was not delivered: {$message}");

            return;
        }

        $this->writeError($frame->id(), self::SERVER_ERROR, $code, $message, $data);
    }

    /**
     * Reads what arrived, waiting for it when asked, and admits each complete line.
     */
    private function admit(bool $wait): void
    {
        $read = [$this->input];
        $none = null;

        if (stream_select($read, $none, $none, $wait ? null : 0) === 0) {
            return;
        }

        stream_set_blocking($this->input, false);
        $chunk = fread($this->input, self::CHUNK_BYTES);
        $this->buffer .= is_string($chunk) ? $chunk : '';
        $this->ended = $chunk === '' && feof($this->input);

        while (($end = strpos($this->buffer, "\n")) !== false) {
            $line = rtrim(substr($this->buffer, 0, $end), "\r");
            $this->buffer = substr($this->buffer, $end + 1);
            $this->admitLine($line, CarbonImmutable::now());
        }

        if ($this->ended && trim($this->buffer) !== '') {
            $this->admitLine(rtrim($this->buffer, "\r"), CarbonImmutable::now());
            $this->buffer = '';
        }
    }

    private function admitLine(string $line, CarbonImmutable $admittedAt): void
    {
        if (trim($line) === '') {
            return;
        }

        if (strlen($line) > LimitMcpMessage::MAX_BYTES) {
            $this->writeError(
                self::idIn($line),
                self::INVALID_REQUEST,
                RefusalCode::InvalidInput,
                'The message is larger than '.LimitMcpMessage::MAX_BYTES.' bytes and was not sent.',
            );

            return;
        }

        if (! mb_check_encoding($line, 'UTF-8')) {
            $this->writeError(
                null,
                self::PARSE_ERROR,
                RefusalCode::InvalidInput,
                'The message is not UTF-8 and was not sent.',
            );

            return;
        }

        $message = json_decode($line, true, LimitMcpMessage::MAX_DEPTH);

        if (json_last_error() === JSON_ERROR_DEPTH) {
            $this->writeError(
                self::idIn($line),
                self::INVALID_REQUEST,
                RefusalCode::InvalidInput,
                'The message is nested deeper than '.LimitMcpMessage::MAX_DEPTH.' levels and was not sent.',
            );

            return;
        }

        if (! is_array($message) || array_is_list($message)) {
            $this->writeError(
                null,
                self::PARSE_ERROR,
                RefusalCode::InvalidInput,
                'The message is not one JSON-RPC object and was not sent.',
            );

            return;
        }

        $this->enqueue(new Frame($line, $message, $admittedAt));
    }

    private function enqueue(Frame $frame): void
    {
        $cancelledId = $frame->cancelledId();

        if ($cancelledId !== null) {
            $this->queue = array_values(
                array_filter($this->queue, fn (Frame $queued): bool => $queued->id() !== $cancelledId),
            );

            return;
        }

        if (count($this->queue) >= self::MOST_QUEUED) {
            $this->refuse(
                $frame,
                RefusalCode::Busy,
                'The relay already holds '.self::MOST_QUEUED.' waiting calls; send it again when one is answered.',
            );

            return;
        }

        $this->queue[] = $frame;
    }

    /**
     * @param  array<string, mixed>  $answer
     */
    private function rememberNegotiatedVersion(Frame $frame, array $answer): void
    {
        $version = $answer['result']['protocolVersion'] ?? null;

        if ($frame->isLegacyInitialize() && is_string($version)) {
            $this->negotiatedVersion = $version;
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function writeError(
        int|string|null $id,
        int $jsonRpcCode,
        RefusalCode $code,
        string $message,
        array $data = [],
    ): void {
        $this->write(json_encode([
            'jsonrpc' => '2.0',
            'id' => $id,
            'error' => [
                'code' => $jsonRpcCode,
                'message' => $message,
                'data' => [
                    'code' => $code->value,
                    'retryable' => $code->isRetryable(),
                    ...array_filter($data, fn (mixed $value): bool => $value !== null),
                ],
            ],
        ], self::JSON_FLAGS));
    }

    private function write(string $line): void
    {
        fwrite($this->output, $line."\n");
        fflush($this->output);
    }

    private function diagnose(string $line): void
    {
        fwrite($this->errors, $line."\n");
    }

    /**
     * The id of a message the relay refuses whole, read without the depth limit only to address the refusal.
     */
    private static function idIn(string $line): int|string|null
    {
        $message = json_decode($line, true);
        $id = is_array($message) ? ($message['id'] ?? null) : null;

        return is_int($id) || is_string($id) ? $id : null;
    }
}
