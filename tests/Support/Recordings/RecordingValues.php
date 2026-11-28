<?php

declare(strict_types=1);

namespace Tests\Support\Recordings;

use App\Recordings\RecordingFakes;
use Tests\Support\Recordings\Exceptions\LiveValueRefused;

/**
 * Binds each fake of a recording to the live value first sent in its place, and puts the live values in place of the
 * fakes in what the recording answers, as the Go recording.Values does. It binds nothing but what the live side sends.
 */
final class RecordingValues
{
    /**
     * @var array<string, string>
     */
    private array $bound = [];

    /**
     * Binds the fakes of the recorded value to the live values the heard one holds in the same places.
     *
     * @throws LiveValueRefused
     */
    public function hear(string $place, mixed $recorded, mixed $heard): void
    {
        if (is_array($recorded)) {
            foreach ($recorded as $key => $value) {
                $this->hear("{$place}.{$key}", $value, is_array($heard) ? $heard[$key] ?? null : null);
            }

            return;
        }

        if (is_string($recorded)) {
            $this->bind($place, $recorded, is_string($heard) ? $heard : '');
        }
    }

    /**
     * The recorded text with each bound fake replaced by its live value; a fake never heard stays.
     */
    public function live(string $recorded): string
    {
        $live = '';
        $from = 0;

        foreach ($this->spansOf($recorded) as [$offset, $fake]) {
            $live .= substr($recorded, $from, $offset - $from).($this->bound[$fake] ?? $fake);
            $from = $offset + strlen($fake);
        }

        return $live.substr($recorded, $from);
    }

    /**
     * @throws LiveValueRefused
     */
    private function bind(string $place, string $recorded, string $heard): void
    {
        [$fakes, $pattern] = $this->fakesOf($recorded);

        if ($fakes === [] && ! $this->isAddress($recorded)) {
            return;
        }

        if ($heard === '') {
            throw LiveValueRefused::empty($place, $recorded);
        }

        $isSameShape = $this->isUrl($recorded) === $this->isUrl($heard)
            && str_starts_with($recorded, '/') === str_starts_with($heard, '/');

        if (! $isSameShape || preg_match($pattern, $heard, $live) !== 1) {
            throw LiveValueRefused::shape($place, $heard, $recorded);
        }

        foreach ($fakes as $index => $fake) {
            $earlier = $this->bound[$fake] ?? $live[$index + 1];

            if ($earlier !== $live[$index + 1]) {
                throw LiveValueRefused::bound($place, $live[$index + 1], $fake, $earlier);
            }

            $other = array_search($live[$index + 1], $this->bound, true);

            if ($other !== false && $other !== $fake) {
                throw LiveValueRefused::standsFor($place, $live[$index + 1], (string) $other);
            }

            $this->bound[$fake] = $live[$index + 1];
        }
    }

    /**
     * The fakes of a recorded string in the order they stand, and a pattern matching a live string of its shape with
     * one group in place of each fake.
     *
     * @return array{list<string>, string}
     */
    private function fakesOf(string $recorded): array
    {
        $pattern = '';
        $from = 0;

        foreach ($this->spansOf($recorded) as [$offset, $fake, $shape]) {
            $pattern .= preg_quote(substr($recorded, $from, $offset - $from), '#')."({$shape})";
            $from = $offset + strlen($fake);
        }

        $fakes = array_map(fn (array $span) => $span[1], $this->spansOf($recorded));

        return [$fakes, '#^'.$pattern.preg_quote(substr($recorded, $from), '#').'$#'];
    }

    /**
     * Where each fake of a recorded string stands, with the shape a live value in its place has: the earliest fake
     * wins, the longest of those starting together, and a fake inside one already taken is part of it.
     *
     * @return list<array{int, string, string}>
     */
    private function spansOf(string $recorded): array
    {
        $found = [];

        foreach (RecordingFakes::fakeShapes() as $fake => $shape) {
            preg_match_all($fake, $recorded, $matches, PREG_OFFSET_CAPTURE);

            foreach ($matches[0] as [$text, $offset]) {
                $found[] = [$offset, $text, trim($shape, '/')];
            }
        }

        usort($found, fn (array $left, array $right) => [$left[0], -strlen($left[1])] <=> [$right[0], -strlen($right[1])]);
        $spans = [];
        $from = 0;

        foreach ($found as $span) {
            if ($span[0] >= $from) {
                $spans[] = $span;
                $from = $span[0] + strlen($span[1]);
            }
        }

        return $spans;
    }

    private function isAddress(string $text): bool
    {
        return $this->isUrl($text) || str_starts_with($text, '/');
    }

    private function isUrl(string $text): bool
    {
        $parts = parse_url($text);

        return is_array($parts) && isset($parts['scheme'], $parts['host']);
    }
}
