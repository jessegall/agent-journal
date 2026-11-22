<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\StartRemedyType;

/**
 * The one next step of a refused start: what it leads to and its words. A step only a host operator can take reads
 * as an instruction to operators, and to every other member as a request to ask their host operator.
 */
final readonly class StartRemedy
{
    private function __construct(
        public StartRemedyType $type,
        public string $text,
        public bool $isForOperators,
    ) {}

    public static function forEveryone(StartRemedyType $type, string $text): self
    {
        return new self($type, $text, false);
    }

    public static function forOperators(StartRemedyType $type, string $text): self
    {
        return new self($type, $text, true);
    }

    /**
     * The step as a host operator reads it.
     */
    public function operatorText(): string
    {
        return $this->text;
    }

    /**
     * The step as a member who does not operate the host reads it.
     */
    public function memberText(): string
    {
        if (! $this->isForOperators) {
            return $this->text;
        }

        return 'Ask your host operator to '.lcfirst($this->text).'.';
    }

    public function isForOperators(): bool
    {
        return $this->isForOperators;
    }
}
