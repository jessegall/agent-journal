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
        return strtr($recorded, $this->bound);
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
        $found = [];

        foreach (RecordingFakes::fakeShapes() as $fake => $shape) {
            preg_match_all($fake, $recorded, $matches, PREG_OFFSET_CAPTURE);

            foreach ($matches[0] as [$text, $offset]) {
                $found[$offset] = [$text, trim($shape, '/')];
            }
        }

        ksort($found);
        $pattern = '';
        $from = 0;

        foreach ($found as $offset => [$text, $shape]) {
            $pattern .= preg_quote(substr($recorded, $from, $offset - $from), '#')."({$shape})";
            $from = $offset + strlen($text);
        }

        $fakes = array_values(array_map(fn (array $fake) => $fake[0], $found));

        return [$fakes, '#^'.$pattern.preg_quote(substr($recorded, $from), '#').'$#'];
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
