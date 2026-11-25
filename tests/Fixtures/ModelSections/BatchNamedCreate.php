<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use App\Concerns\InsertsRowSets;
use Illuminate\Database\Eloquent\Model;

/**
 * A model whose only constructor writes a batch, yet is named create and gives nothing back.
 */
final class BatchNamedCreate extends Model
{
    use InsertsRowSets;

    // ----------[ Constructors ]----------

    /**
     * @param  list<string>  $names
     */
    public static function create(array $names): void
    {
        $rows = array_map(fn (string $name) => new self(['name' => $name]), $names);

        self::insertRows($rows);
    }
}
