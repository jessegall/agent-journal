<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use App\Http\Middleware\Mcp\LimitMcpMessage;
use App\Mcp\Data\BusyReplyData;
use App\Mcp\Data\InitializeResultData;
use App\Mcp\Data\JsonRpcIdData;
use App\Mcp\Data\JsonRpcMessageData;
use App\Mcp\Data\JsonRpcReplyData;
use App\Support\AgentCallReply;
use Carbon\CarbonImmutable;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use Spatie\LaravelData\Optional;
use Throwable;
use TypeError;

/**
 * The relay's side of a started driver's stdio: newline-delimited UTF-8 frames read without buffering past what
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

        $answer = $this->jsonRpcReplyIn($reply->body);

        if ($answer !== null && $answer->jsonrpc === '2.0') {
            $this->rememberNegotiatedVersion($frame, $answer);
            $this->write(json_encode($answer, self::JSON_FLAGS));

            return;
        }

        match (true) {
            $reply->status === 401 => $this->refuse(
                $frame,
                RefusalCode::Unauthenticated,
                'The journal did not accept this start token.',
            ),
            $reply->status === 429 => $this->refuse(
                $frame,
                RefusalCode::Busy,
                'Too many calls; send it again after the wait.',
                ['retry_after_seconds' => $this->retryAfterIn($reply->body)],
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
     */
    public function fail(Frame $frame, CodedRefusal&Throwable $failure): void
    {
        $this->refuse($frame, $failure->refusalCode(), $failure->getMessage());
    }

    /**
     * @param  array<string, mixed>  $errorDetails
     */
    private function refuse(Frame $frame, RefusalCode $code, string $message, array $errorDetails = []): void
    {
        if (! $frame->isRequest()) {
            $this->diagnose("A {$frame->method()} message was not delivered: {$message}");

            return;
        }

        $this->writeError($frame->id(), self::SERVER_ERROR, $code, $message, $errorDetails);
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

        if (strlen($line) > LimitMcpMessage::BYTE_LIMIT) {
            $this->writeError(
                JsonRpcIdData::idIn($line),
                self::INVALID_REQUEST,
                RefusalCode::InvalidInput,
                'The message is larger than '.LimitMcpMessage::BYTE_LIMIT.' bytes and was not sent.',
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

        try {
            $message = JsonRpcMessageData::from(
                json_decode($line, true, LimitMcpMessage::MAX_DEPTH, JSON_THROW_ON_ERROR),
            );
        } catch (JsonException $broken) {
            $this->refuseBroken($line, $broken);

            return;
        } catch (CannotCreateData|TypeError) {
            $this->refuseUnreadable();

            return;
        }

        $this->enqueue(new Frame($line, $message, $admittedAt));
    }

    /**
     * Refuses a line that is not JSON, naming the depth limit when that is what it broke.
     */
    private function refuseBroken(string $line, JsonException $broken): void
    {
        if ($broken->getCode() === JSON_ERROR_DEPTH) {
            $this->refuseTooDeep($line);

            return;
        }

        $this->refuseUnreadable();
    }

    private function refuseTooDeep(string $line): void
    {
        $this->writeError(
            JsonRpcIdData::idIn($line),
            self::INVALID_REQUEST,
            RefusalCode::InvalidInput,
            'The message is nested deeper than '.LimitMcpMessage::MAX_DEPTH.' levels and was not sent.',
        );
    }

    private function refuseUnreadable(): void
    {
        $this->writeError(
            null,
            self::PARSE_ERROR,
            RefusalCode::InvalidInput,
            'The message is not one JSON-RPC object and was not sent.',
        );
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
     * Keeps the protocol version a legacy initialize negotiated, for the frames that follow it.
     */
    private function rememberNegotiatedVersion(Frame $frame, JsonRpcReplyData $answer): void
    {
        if (! $frame->negotiatesVersion() || $answer->result instanceof Optional) {
            return;
        }

        $this->negotiatedVersion = InitializeResultData::from($answer->result)->protocolVersion;
    }

    /**
     * @param  array<string, mixed>  $details
     */
    private function writeError(
        int|string|null $id,
        int $jsonRpcCode,
        RefusalCode $code,
        string $message,
        array $details = [],
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
                    ...array_filter($details, fn (mixed $detail): bool => $detail !== null),
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
     * The journal's answer as a JSON-RPC reply, or null when its body is not one, such as a refusal before the call;
     * why it is not one is written to the relay's diagnostics by class and message.
     */
    private function jsonRpcReplyIn(string $body): JsonRpcReplyData|null
    {
        try {
            return JsonRpcReplyData::from(json_decode($body, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError $failure) {
            $this->diagnose(
                'The journal\'s answer is not a JSON-RPC reply ('.$failure::class.': '.$failure->getMessage().').',
            );

            return null;
        }
    }

    /**
     * The seconds a busy refusal asks the driver to wait, when its body says.
     */
    private function retryAfterIn(string $body): int|null
    {
        try {
            return BusyReplyData::from(json_decode($body, true, 512, JSON_THROW_ON_ERROR))->retryAfterSeconds;
        } catch (JsonException|CannotCreateData|TypeError $failure) {
            $this->diagnose('The busy answer names no wait ('.$failure::class.': '.$failure->getMessage().').');

            return null;
        }
    }
}
