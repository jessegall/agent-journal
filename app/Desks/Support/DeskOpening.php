<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Communication\Models\InboxRecord;
use App\Desks\Exceptions\DeskSeatCountInvalid;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use Illuminate\Support\Str;

/**
 * Opens desks: each desk gets its inbox and its seats, three kinds of row made together.
 */
final readonly class DeskOpening
{
    /**
     * A named desk with its seats, from one to a hundred.
     *
     * @throws DeskSeatCountInvalid
     */
    public function openNamed(string $name, string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        return $this->open($name, $label, self::checkedSeatCount($seatCount), $forwardsOccupants);
    }

    /**
     * The named desk, opened with its seats the first time and found by its name after that.
     *
     * @throws DeskSeatCountInvalid
     */
    public function installNamed(string $name, string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        return DeskRecord::query()->named($name)->first()
            ?? $this->openNamed($name, $label, $seatCount, $forwardsOccupants);
    }

    /**
     * The named source desk, opened the first time and found by its name after that.
     */
    public function installSourceDesk(string $name, string $label): DeskRecord
    {
        return DeskRecord::query()->named($name)->first() ?? $this->openSourceDesk($name, $label);
    }

    /**
     * An unnamed desk shared by up to a hundred seated actors.
     *
     * @throws DeskSeatCountInvalid
     */
    public function openShared(string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        return $this->open(null, $label, self::checkedSeatCount($seatCount), $forwardsOccupants);
    }

    /**
     * An actor's own unnamed desk with one seat.
     */
    public function openPersonal(string $label): DeskRecord
    {
        return $this->open(null, $label, 1, false);
    }

    /**
     * A named desk with no seats, which only sends: a trusted source such as the journal itself.
     */
    public function openSourceDesk(string $name, string $label): DeskRecord
    {
        return $this->open($name, $label, 0, false);
    }

    private function open(string|null $name, string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        $id = (string) Str::ulid();
        $inbox = InboxRecord::create(DeskRecord::INBOX_PROVIDER, $id);
        $desk = DeskRecord::create($id, $name, $label, $inbox->id, $seatCount, $forwardsOccupants);

        for ($number = 1; $number <= $seatCount; $number++) {
            DeskSeat::create($desk, $number);
        }

        return $desk;
    }

    /**
     * @throws DeskSeatCountInvalid
     */
    private static function checkedSeatCount(int $count): int
    {
        if ($count < 1 || $count > DeskRecord::LARGEST_SEAT_COUNT) {
            throw DeskSeatCountInvalid::for($count);
        }

        return $count;
    }
}
