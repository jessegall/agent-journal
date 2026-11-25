<?php

declare(strict_types=1);

namespace Tests\Fixtures\ArrayWrites;

use Illuminate\Database\Eloquent\Model;

/**
 * A model that writes rows through arrays four ways, which are refused, beside a property write and a mass update of
 * the rows a query chose, which pass.
 *
 * @property string $title
 * @property string $state
 */
final class Ticket extends Model
{
    public static function created(string $title): self
    {
        return self::query()->create(['title' => $title]);
    }

    public static function built(string $title): self
    {
        return new self(['title' => $title]);
    }

    public static function found(string $title): self
    {
        return self::query()->firstOrCreate(['title' => $title]);
    }

    public static function assigned(string $title): self
    {
        $ticket = new self();
        $ticket->title = $title;
        $ticket->save();

        return $ticket;
    }

    public static function closeAll(): void
    {
        self::query()->where('state', 'open')->update(['state' => 'closed']);
    }

    public function rename(string $title): void
    {
        $this->update(['title' => $title]);
    }
}
