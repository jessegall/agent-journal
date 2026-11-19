<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ShareBudget;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\SharedContent;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecords;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;
use Illuminate\Support\Facades\DB;

/**
 * Reads every batch of binder pages with one query, at the versions BinderPublications names; the record with the
 * ineligible id is never disclosable.
 */
final class BinderShareProvider implements ShareRecordProvider
{
    public const string INELIGIBLE_ID = '01jd8x0g9m3qz6v4k200000999';

    public const string HIDDEN_ROOT_ID = '01jd8x0g9m3qz6v4k200000998';

    public function __construct(private readonly BinderPublications $publications) {}

    public function mayDisclose(RecordIdentity $record): bool
    {
        return ! in_array($record->id, [self::INELIGIBLE_ID, self::HIDDEN_ROOT_ID], true);
    }

    public function preview(ShareSelection $selection, ShareBudget $budget): ShareRecordCard
    {
        return $this->card($selection->root);
    }

    public function readTargets(ShareTargetRead $read, ShareBudget $budget): ShareRecords
    {
        DB::select('select 1');
        $eligible = array_values(
array_filter($read->targets, fn (RecordIdentity $target) => $this->mayDisclose($target)),
);
        $ineligible = array_values(
array_filter($read->targets, fn (RecordIdentity $target) => ! $this->mayDisclose($target)),
);

        return new ShareRecords(array_map($this->card(...), $eligible), $ineligible, null);
    }

    public function readRelated(ShareRelationRead $read, ShareBudget $budget): ShareRecords
    {
        return new ShareRecords([], [], null);
    }

    public function content(ShareContentRead $read, ShareBudget $budget): SharedContent
    {
        return new SharedContent($this->card($read->record), 'A binder page.');
    }

    private function card(RecordIdentity $record): ShareRecordCard
    {
        return new ShareRecordCard($record, "Page {$record->id}", $this->publications->versionOf($record->id));
    }
}
