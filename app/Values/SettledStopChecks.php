<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The settled stop attempts a ready state heard, each attempt's outcome by its id, so a run of unchanged failures is
 * counted in the order the attempts were opened, whatever order their results came back in.
 */
final readonly class SettledStopChecks
{
    /**
     * @param  array<string, string>  $outcomes  attempt id => the outcome it settled with
     */
    public function __construct(private array $outcomes) {}

    /**
     * How many attempts opened right before this one settled with the same outcome, in a row.
     */
    public function unchangedBefore(string $attemptId, string $outcome): int
    {
        $earlier = array_filter(
            $this->outcomes,
            fn (string $settledId) => strcmp($settledId, $attemptId) < 0,
            ARRAY_FILTER_USE_KEY,
        );

        krsort($earlier, SORT_STRING);
        $unchanged = 0;

        foreach ($earlier as $settledOutcome) {
            if ($settledOutcome !== $outcome) {
                break;
            }

            $unchanged++;
        }

        return $unchanged;
    }
}
