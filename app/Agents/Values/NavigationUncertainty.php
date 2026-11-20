<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\NavigationReason;
use App\Agents\Exceptions\NavigationRaiseRefused;

/**
 * Where a key script run could not be certain, as the host raised it: why, at which step, and the stable screen it
 * stopped on with that screen's fingerprint, and, after a stale replay, the entry and the steps it already sent.
 */
final readonly class NavigationUncertainty
{
    private const int MOST_ROWS = 60;

    private const int MOST_ROW_CHARACTERS = 300;

    private const string FINGERPRINT = '/^fp1:[0-9a-f]{64}$/';

    /**
     * @param  list<string>  $sentSteps  the steps a stale entry's replay already sent before it failed, by name
     */
    public function __construct(
        public NavigationReason $reason,
        public int $stalledStep,
        public string $fingerprint,
        public NavigationScreen $screen,
        public string|null $staleEntryId = null,
        public array $sentSteps = [],
    ) {}

    /**
     * @param  list<string>  $sentSteps
     */
    public static function fromHost(
        NavigationReason $reason,
        int $stalledStep,
        string $fingerprint,
        NavigationScreen $screen,
        string|null $staleEntryId,
        array $sentSteps,
    ): self {
        self::assertScreenIsValid($screen, $fingerprint);

        return new self(
            $reason,
            $stalledStep,
            $fingerprint,
            $screen,
            $staleEntryId,
            array_map(fn (string $step) => mb_substr($step, 0, 200), array_slice($sentSteps, 0, 20)),
        );
    }

    private static function assertScreenIsValid(NavigationScreen $screen, string $fingerprint): void
    {
        if (count($screen->rows) > self::MOST_ROWS) {
            throw NavigationRaiseRefused::tooManyRows(count($screen->rows), self::MOST_ROWS);
        }
        foreach ($screen->rows as $row => $text) {
            if (mb_strlen($text) > self::MOST_ROW_CHARACTERS) {
                throw NavigationRaiseRefused::rowTooLong($row, self::MOST_ROW_CHARACTERS);
            }
        }
        if (preg_match(self::FINGERPRINT, $fingerprint) !== 1) {
            throw NavigationRaiseRefused::fingerprintMalformed($fingerprint);
        }
    }
}
