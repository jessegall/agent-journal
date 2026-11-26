<?php

declare(strict_types=1);

namespace App\Stacks\Values;

use App\Stacks\Decisions\MessageLine;
use App\Support\Decisions\Decision;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The stop gate's answer to one stop: the reply for the agent, and the stop attempt it opened for the stop, if any.
 */
final readonly class StopAnswer
{
    /**
     * @param  Option<string>  $attemptId
     */
    public function __construct(
        public Decision|MessageLine $reply,
        public Option $attemptId,
    ) {}

    public static function withoutAttempt(Decision|MessageLine $reply): self
    {
        return new self($reply, None::create());
    }

    public static function forAttempt(string $attemptId, Decision|MessageLine $reply): self
    {
        return new self($reply, new Some($attemptId));
    }
}
