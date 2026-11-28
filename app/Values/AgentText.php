<?php

declare(strict_types=1);

namespace App\Values;

use App\Actors\Contracts\AgentTexts;

/**
 * A text the journal puts in an agent's context, by its registered key and the values of its placeholders. Core's
 * keys start with core and live in lang/<language>/agent.php; a domain's start with its own name, in its lang folder.
 * AgentTexts turns it into words where it reaches the agent.
 */
final readonly class AgentText
{
    /**
     * @param  array<string, string|int|AgentText>  $values
     */
    private function __construct(public string $key, public array $values) {}

    /**
     * The text registered under the key, with these values for its placeholders.
     *
     * @param  array<string, string|int|AgentText>  $values
     */
    public static function of(string $key, array $values = []): self
    {
        return new self($key, $values);
    }

    /**
     * The text itself, or the text registered under a key with no values; the key is checked where it is written.
     */
    public static function ofKeyOrText(self|string $text): self
    {
        if (is_string($text)) {
            return new self($text, []);
        }

        return $text;
    }
}
