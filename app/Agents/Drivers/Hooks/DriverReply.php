<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Exceptions\DriverReplyMalformed;
use App\Hooks\Enums\AnswerType;
use App\Support\Storage\RecordedAnswer;
use JsonException;
use JsonSerializable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * What the journal hands back to a driver's hook: its standard output, standard error and exit code.
 */
final readonly class DriverReply implements JsonSerializable
{
    private const string NO_OUTPUT = '';

    private const int BLOCKING_EXIT = 2;

    public function __construct(
        public string $stdout,
        public string $stderr,
        public int $exitCode,
    ) {}

    public static function fromRecorded(RecordedAnswer $answer): self
    {
        return new self($answer->stdout, $answer->stderr, $answer->exitCode);
    }

    /**
     * The reply the journal sent for a hook call.
     *
     * @throws JsonException when the body is not JSON
     * @throws DriverReplyMalformed when it is not a reply of standard output, standard error and exit code
     */
    public static function fromJournal(string $body): self
    {
        try {
            return DriverReplyData::from(json_decode($body, true, 4, JSON_THROW_ON_ERROR))->reply();
        } catch (CannotCreateData|TypeError $malformed) {
            throw DriverReplyMalformed::because($malformed);
        }
    }

    /**
     * A refusal the driver reads on standard error, with the exit code that blocks the call and nothing on output.
     */
    public static function refusedOnStandardError(string $refusal): self
    {
        return new self(stdout: self::NO_OUTPUT, stderr: $refusal."\n", exitCode: self::BLOCKING_EXIT);
    }

    public static function emptyObject(): self
    {
        return new self('{}', '', 0);
    }

    public static function json(Data $body): self
    {
        return new self(
            json_encode(
                (object) $body->toArray(),
                JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
            ),
            '',
            0,
        );
    }

    /**
     * @return array{stdout: string, stderr: string, exitCode: int}
     */
    public function jsonSerialize(): array
    {
        return [
            'stdout' => $this->stdout,
            'stderr' => $this->stderr,
            'exitCode' => $this->exitCode,
        ];
    }

    public function recordedAs(AnswerType $type): RecordedAnswer
    {
        return RecordedAnswer::of($type, $this->stdout, $this->stderr, $this->exitCode);
    }
}
