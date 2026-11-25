<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The script an activated profile revision runs: the source it was written in and what it compiled to. A revision
 * without a script runs the empty one, which handles nothing (user message 22097).
 */
final readonly class ProfileScript
{
    public function __construct(public ScriptSource $source, public CompiledScript $compiled) {}

    /**
     * The script of a revision that has none: no source, no handlers.
     */
    public static function empty(): self
    {
        $source = ScriptSource::none();
        $compiled = CompiledScript::empty();

        return new self($source, $compiled);
    }

    /**
     * Whether the script answers the trigger, such as STOP, with a handler of its own.
     */
    public function handles(string $trigger): bool
    {
        return array_key_exists($trigger, $this->compiled->handlers);
    }
}
