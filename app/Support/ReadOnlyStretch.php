<?php

declare(strict_types=1);

namespace App\Support;

use Closure;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Marks the stretch of a request in which something only reads, a skill condition or a read tool, so the bus refuses
 * any command run inside it and names what was reading.
 */
final class ReadOnlyStretch
{
    /**
     * @var list<string> what reads now, the innermost last
     */
    private array $readers = [];

    /**
     * @template T
     *
     * @param  string  $reader  what reads, as a refusal names it: a skill condition, the read tool outputs_read
     * @param  Closure(): T  $read
     * @return T
     */
    public function during(string $reader, Closure $read): mixed
    {
        $this->readers[] = $reader;

        try {
            return $read();
        } finally {
            array_pop($this->readers);
        }
    }

    /**
     * What reads now, when the request is inside a read-only stretch.
     *
     * @return Option<string>
     */
    public function reader(): Option
    {
        if ($this->readers === []) {
            return None::create();
        }

        return new Some($this->readers[array_key_last($this->readers)]);
    }
}
