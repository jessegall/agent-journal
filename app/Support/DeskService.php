<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\DeskSeatCountInvalid;
use App\Models\Chats\InboxRecord;
use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;
use Illuminate\Support\Str;

/**
 * Opens desks: each desk gets its inbox and its seats, three kinds of row made together.
 */
final readonly class DeskService
{
    /**
     * A named desk with its seats, from one to a hundred.
     *
     * @throws DeskSeatCountInvalid
     */
    public function openNamed(string $name, string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        return $this->openWithSeats($name, $label, $seatCount, $forwardsOccupants);
    }

    /**
     * The named desk, opened with its seats the first time and found by its name after that.
     *
     * @throws DeskSeatCountInvalid
     */
    public function installNamed(string $name, string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        return DeskRecord::withName($name)->getOrCall(
            fn () => $this->openNamed($name, $label, $seatCount, $forwardsOccupants),
        );
    }

    /**
     * The named source desk, opened the first time and found by its name after that.
     */
    public function installSourceDesk(string $name, string $label): DeskRecord
    {
        return DeskRecord::withName($name)->getOrCall(fn () => $this->openSourceDesk($name, $label));
    }

    /**
     * An unnamed desk shared by up to a hundred seated actors.
     *
     * @throws DeskSeatCountInvalid
     */
    public function openShared(string $label, int $seatCount, bool $forwardsOccupants): DeskRecord
    {
        return $this->openWithSeats(null, $label, $seatCount, $forwardsOccupants);
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
     * A desk with the seat count someone asked for, which must be at least one and at most the largest.
     *
     * @throws DeskSeatCountInvalid
     */
    private function openWithSeats(
        string|null $name,
        string $label,
        int $count,
        bool $forwardsOccupants,
    ): DeskRecord {
        if ($count < 1 || $count > DeskRecord::LARGEST_SEAT_COUNT) {
            throw DeskSeatCountInvalid::for($count);
        }

        return $this->open($name, $label, $count, $forwardsOccupants);
    }
}
