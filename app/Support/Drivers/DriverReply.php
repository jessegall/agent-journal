<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Enums\AnswerType;
use App\Exceptions\DriverReplyMalformed;
use App\Support\Storage\RecordedAnswer;
use JsonException;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * What the journal hands back to a driver's hook: its standard output, standard error and exit code.
 */
final readonly class DriverReply
{
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

    public function recordedAs(AnswerType $type): RecordedAnswer
    {
        return RecordedAnswer::of($type, $this->stdout, $this->stderr, $this->exitCode);
    }
}
