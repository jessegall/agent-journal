<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ActorDesks;
use App\Models\DeskPreference;
use App\Models\DeskRecord;

/**
 * Keeps an active actor reachable after it lost a seat: with no seat left it gets a new personal desk, and when it
 * lost its preferred desk it prefers another desk it sits at, forwarding desks first.
 */
final readonly class SeatLossRepair
{
    public const string PERSONAL_LABEL = 'Personal inbox';

    public function __construct(private ActorDesks $desks, private DeskPreferences $preferences) {}

    public function afterLoss(ActorIdentity $actor, DeskRecord $lost): void
    {
        $remaining = DeskRecord::query()->occupiedBy($actor)->orderByDesc('forwards_occupants')->orderBy('id')->first();

        if ($remaining === null) {
            $this->desks->provision($actor, self::PERSONAL_LABEL);

            return;
        }

        if (DeskPreference::isPreferredBy($actor, $lost)) {
            $this->preferences->prefer($actor, $remaining);
        }
    }
}
