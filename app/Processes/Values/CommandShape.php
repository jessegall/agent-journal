<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ReviewLimit;

/**
 * A command's shape: its program and subcommand with every value replaced by a typed slot, the only form of a command
 * an agent is ever shown for classification.
 */
final readonly class CommandShape
{
    public function __construct(
        public string $id,
        public string $program,
        public string $subcommand,
        public string $text,
    ) {}

    public function length(): int
    {
        return mb_strlen($this->text);
    }

    /**
     * Whether the shape is too long to send to an agent, so its command stays unclassified.
     */
    public function isTooLongForReview(): bool
    {
        return ReviewLimit::ShapeCharacters->isPassedBy($this->length());
    }

    /**
     * The refusal for a command whose shape is too long to review, naming the limit so the agent can split it.
     */
    public function refusal(): string
    {
        $limit = ReviewLimit::ShapeCharacters->label();

        return "This command's shape is {$this->length()} characters, past the {$limit} an agent may be sent for "
            .'classification: split it into shorter commands.';
    }
}
