<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * A model whose asserts break the assert rule: one judges a row its finder read, and one is called after the work of
 * its method; an assert of a save's result and one behind a leave-early guard stand.
 *
 * @property string $state
 */
final class AssertsThatJudgeReads extends Model
{
    // ----------[ Mutations ]----------

    public function close(): void
    {
        if ($this->state === 'closed') {
            return;
        }

        $this->assertOpen();
        $this->state = 'closed';
        $this->saveAndAssert();
    }

    public function reopen(): void
    {
        $this->state = 'open';
        $this->assertOpen();
    }

    // ----------[ Asserts ]----------

    private function assertOpen(): void
    {
        if ($this->state !== 'open') {
            throw new RuntimeException('Closed.');
        }
    }

    private function assertSaved(bool $isSaved): void
    {
        if (! $isSaved) {
            throw new RuntimeException('Not saved.');
        }
    }

    private static function assertFound(self|null $row): void
    {
        if ($row === null) {
            throw new RuntimeException('Missing.');
        }
    }

    // ----------[ Queries ]----------

    public static function ofId(string $id): self
    {
        $row = self::query()->whereKey($id)->first();
        self::assertFound($row);

        return $row;
    }
}
