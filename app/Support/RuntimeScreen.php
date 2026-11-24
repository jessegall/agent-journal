<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\Terminals\ScreenFrameData;
use App\Data\Terminals\StoredScreenData;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Cache\Repository;

/**
 * The latest frame of each runtime's screen with the identity it was admitted under, kept only in the cache and gone a
 * minute after the last frame; a frame is never written to the database or a log.
 */
final readonly class RuntimeScreen
{
    /**
     * How long a runtime's latest frame is kept after it arrived.
     */
    public const int KEEP_SECONDS = 60;

    public function __construct(private Repository $cache) {}

    /**
     * Keeps the frame as the runtime's latest when its identity is the current one or newer, and says whether it did.
     * The caller holds the runtime's row lock, so registration changes and admissions of one runtime never interleave;
     * a shield frame replaces the stored public one with no rows.
     */
    public function admit(ScreenRegistration $registration, ScreenFrameData $frame, CarbonImmutable $receivedAt): bool
    {
        $arriving = new ReceivedScreen($frame, ScreenIdentity::ofReport($registration, $frame), $receivedAt);
        $slot = $this->slotOf($registration->runtimeId);

        if ($slot === null) {
            $this->keep($registration->runtimeId, ScreenSlot::first($arriving));

            return true;
        }

        if (! $slot->admits($arriving)) {
            return false;
        }

        $this->keep($registration->runtimeId, $slot->replacedBy($arriving));

        return true;
    }

    /**
     * The runtime's latest screen when it was admitted under the registration the reader expects; a runtime that
     * ended keeps only its own last frame, and any other registration sees nothing.
     */
    public function latest(ScreenRegistration $expected): ReceivedScreen|null
    {
        return $this->slotOf($expected->runtimeId)?->screenFor($expected);
    }

    private function slotOf(string $runtimeId): ScreenSlot|null
    {
        $stored = $this->cache->get($this->key($runtimeId));

        return is_array($stored) ? ScreenSlot::fromStored(StoredScreenData::from($stored)) : null;
    }

    private function keep(string $runtimeId, ScreenSlot $slot): void
    {
        $this->cache->put($this->key($runtimeId), $slot->stored()->toArray(), self::KEEP_SECONDS);
    }

    private function key(string $runtimeId): string
    {
        return "runtime-screen:{$runtimeId}";
    }
}
