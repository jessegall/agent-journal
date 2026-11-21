<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A model that writes only its own row, in every allowed form.
 *
 * @property string $name
 */
final class OwnRowWriter extends Model
{
    public static function create(string $name): self
    {
        $writer = new self(['name' => $name]);
        $writer->save();

        return $writer;
    }

    public static function createByQuery(string $name): self
    {
        return self::query()->create(['name' => $name]);
    }

    public static function createThroughHelper(string $name): self
    {
        $writer = self::draft($name);
        $writer->save();

        return $writer;
    }

    public function rename(string $name): void
    {
        $this->name = $name;
        $this->save();
    }

    public function renameThroughAlias(string $name): void
    {
        $alias = $this;
        $alias->name = $name;
        $alias->save();
    }

    public function fillAndSave(string $name): void
    {
        $this->fill(['name' => $name])->save();
    }

    public function countVisit(): void
    {
        $this->increment('times');
    }

    public function forget(): void
    {
        $this->delete();
    }

    private static function draft(string $name): self
    {
        return new self(['name' => $name]);
    }
}
