<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

use App\Support\Domain;
use App\Support\Exports;
use App\Contracts\ShareRecordContributor;
use App\Support\ShareRecordDefinition;

final class BindersDomain extends Domain implements ShareRecordContributor
{
    public function description(): string
    {
        return 'A fixture domain whose binders link to sheets, cards and tabs, three shareable types, and to memos, '
            .'which are not linkable for sharing.';
    }

    public function requires(): array
    {
        return [];
    }

    public function exports(): Exports
    {
        return Exports::make()->build();
    }

    public function shareRecords(): array
    {
        return [
            new ShareRecordDefinition('binders.binder', Binder::class, BinderShareProvider::class, []),
            new ShareRecordDefinition(
'binders.sheet',
 BinderPage::class,
 BinderShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordDefinition(
'binders.card',
 BinderPage::class,
 BinderShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordDefinition(
'binders.tab',
 BinderPage::class,
 BinderShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordDefinition('binders.memo', BinderPage::class, BinderShareProvider::class, []),
        ];
    }
}
