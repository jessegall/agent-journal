<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\AgentTextUnknown;
use App\Exceptions\AgentTextValuesMismatch;
use Illuminate\Support\Facades\Lang;

/**
 * A text the journal puts in an agent's context, by its registered key and the values of its placeholders. Core's
 * keys start with core and live in lang/<language>/agent.php; a domain's start with its own name, in its lang folder.
 */
final readonly class AgentText
{
    private const string PLACEHOLDER = '/\{([a-z_]+)\}/';

    private function __construct(public string $key, public string $text) {}

    /**
     * The text registered under the key, with each placeholder filled; an unknown key or a value missing or left over
     * fails, so no text reaches an agent half written.
     *
     * @param  array<string, string|int>  $values
     */
    public static function of(string $key, array $values = []): self
    {
        $line = self::translationKeyOf($key);

        $registered = Lang::has($line) ? Lang::get($line) : null;

        if (! is_string($registered)) {
            throw AgentTextUnknown::forKey($key);
        }

        preg_match_all(self::PLACEHOLDER, $registered, $placeholders);
        $declared = array_values(array_unique($placeholders[1]));
        $given = array_keys($values);
        sort($declared);
        sort($given);

        if ($declared !== $given) {
            throw AgentTextValuesMismatch::forKey($key, $declared, $given);
        }

        $replacements = [];

        foreach ($values as $name => $value) {
            $replacements['{'.$name.'}'] = (string) $value;
        }

        return new self($key, strtr($registered, $replacements));
    }

    /**
     * Where the translator keeps the key: Core's in the agent file of the application, a domain's under its own name.
     */
    private static function translationKeyOf(string $key): string
    {
        [$owner, $name] = explode('.', $key, 2) + [1 => ''];

        return $owner === 'core' ? "agent.{$name}" : "{$owner}::agent.{$name}";
    }
}
