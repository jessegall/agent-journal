<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\EventSource;
use App\Concerns\RaisesEvents;
use Illuminate\Database\Eloquent\Model;

/**
 * A model that raises a fact of its rename, only once its own save returned true.
 *
 * @property int $id
 * @property string $name
 * @property int $times
 */
final class RaisingRow extends Model implements EventSource
{
    use RaisesEvents;

    protected $table = 'raising_rows';

    protected $fillable = ['name', 'times'];

    /**
     * Inserts the row unless its id is taken, raising its fact only when it inserted.
     */
    public static function claimOnce(int $id, string $name): self
    {
        $row = new self();
        $row->id = $id;
        $row->name = $name;

        if ($row->insertIfAbsent()) {
            $row->raise(new RowRenamed($id, $name));
        }

        return $row;
    }

    public function rename(string $name): void
    {
        $this->name = $name;
        $this->assertSaved($this->save());
        $this->raise(new RowRenamed($this->id, $name));
    }

    /**
     * Counts a visit as an attribute change and its own save, which the capture sees.
     */
    public function countVisit(): void
    {
        $this->times++;
        $this->assertSaved($this->save());
        $this->raise(new RowRenamed($this->id, $this->name));
    }

    public function note(): void
    {
        $this->touch();
        $this->raise(new RowNoted($this->id));
    }
}
