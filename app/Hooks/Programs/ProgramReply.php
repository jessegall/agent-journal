<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Enums\AnswerType;
use App\Hooks\Exceptions\ProgramReplyMalformed;
use App\Hooks\Storage\RecordedAnswer;
use JsonException;
use Spatie\LaravelData\Data;

/**
 * What the journal hands back to a program's hook: its standard output, standard error and exit code.
 */
final readonly class ProgramReply
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
     * @throws ProgramReplyMalformed when it lacks a field of a reply
     */
    public static function fromJournal(string $body): self
    {
        $answer = json_decode($body, true, 4, JSON_THROW_ON_ERROR);

        foreach (['stdout', 'stderr', 'exitCode'] as $field) {
            if (! is_array($answer) || ! array_key_exists($field, $answer)) {
                throw ProgramReplyMalformed::missing($field);
            }
        }

        return new self((string) $answer['stdout'], (string) $answer['stderr'], (int) $answer['exitCode']);
    }

    public static function emptyObject(): self
    {
        return new self('{}', '', 0);
    }

    public static function json(Data $body): self
    {
        return new self(json_encode((object) $body->toArray(), JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), '', 0);
    }

    public function recordedAs(AnswerType $type): RecordedAnswer
    {
        return RecordedAnswer::of($type, $this->stdout, $this->stderr, $this->exitCode);
    }
}
