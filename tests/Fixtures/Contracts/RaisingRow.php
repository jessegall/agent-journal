<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\EventSource;
use App\Contracts\RaisesEvents;
use Illuminate\Database\Eloquent\Model;

/**
 * A model that raises a fact of its rename, only once its own save returned true.
 *
 * @property int $id
 * @property string $name
 */
final class RaisingRow extends Model implements EventSource
{
    use RaisesEvents;

    protected $table = 'raising_rows';

    public function rename(string $name): void
    {
        $this->name = $name;
        $this->assertSaved($this->save());
        $this->raise(new RowRenamed($this->id, $name));
    }

    public function note(): void
    {
        $this->touch();
        $this->raise(new RowNoted($this->id));
    }
}
