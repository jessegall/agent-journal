<?php

declare(strict_types=1);

namespace Tests\Support\Mocks;

use JsonSerializable;

/**
 * One part of a mock's answer, as its script holds it: a reply or a notification from a recording, or a wait for a
 * test's step.
 */
final readonly class MockAction implements JsonSerializable
{
    private function __construct(
        private string $type,
        private string $recording,
        private string $method,
        private string $step,
    ) {}

    public static function reply(string $recording): self
    {
        return new self('reply', $recording, '', '');
    }

    public static function notification(string $recording, string $method): self
    {
        return new self('notify', $recording, $method, '');
    }

    public static function wait(string $step): self
    {
        return new self('wait', '', '', $step);
    }

    /**
     * @return array<string, string>
     */
    public function jsonSerialize(): array
    {
        return ['type' => $this->type, 'recording' => $this->recording, 'method' => $this->method, 'step' => $this->step];
    }
}
