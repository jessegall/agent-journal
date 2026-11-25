<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Models;

use App\Contracts\Records\ReadableModel;
use App\Concerns\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A question an agent asked: answered or not, and when it was reminded, at most once.
 *
 * @property string $id
 * @property string $text
 * @property bool $answered
 * @property CarbonImmutable|null $reminded_at
 */
#[Fillable(['text'])]
#[Table('reminder_questions')]
final class Question extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'answered' => 'boolean',
            'reminded_at' => 'immutable_datetime',
        ];
    }

    public static function findLockedById(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    public function answer(): void
    {
        $this->answered = true;
        $this->save();
    }

    public function isWaiting(): bool
    {
        return ! $this->answered && $this->reminded_at === null;
    }

    public function remindAt(CarbonImmutable $time): void
    {
        $this->reminded_at = $time;
        $this->save();
    }

    public static function ask(string $text): self
    {
        return self::query()->create(['text' => $text]);
    }

}
