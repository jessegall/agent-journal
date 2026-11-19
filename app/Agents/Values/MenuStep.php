<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * One step of a menu library entry: the fingerprint of the screen it expects, and what it does there, a label to
 * choose when the main agent confirmed a menu entry or else a named key, with the text that proves it when it has
 * one. Arrow presses and screen text are never stored.
 */
final readonly class MenuStep
{
    public function __construct(
        public string $fingerprint,
        public string|null $choose,
        public string|null $key,
        public string|null $proof,
    ) {}

    /**
     * The step as the entry's steps column keeps it.
     *
     * @param  array{fingerprint: string, choose: string|null, key: string|null, proof: string|null}  $stored
     */
    public static function fromStored(array $stored): self
    {
        return new self($stored['fingerprint'], $stored['choose'], $stored['key'], $stored['proof']);
    }

    /**
     * @return array{fingerprint: string, choose: string|null, key: string|null, proof: string|null}
     */
    public function toStored(): array
    {
        return [
            'fingerprint' => $this->fingerprint,
            'choose' => $this->choose,
            'key' => $this->key,
            'proof' => $this->proof,
        ];
    }
}
