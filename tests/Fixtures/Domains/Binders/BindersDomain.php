<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Binders;

use App\Domains\Support\Domain;
use App\Exports\Support\Exports;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Support\ShareRecordRegistration;

final class BindersDomain extends Domain implements ProvidesShareRecords
{
    public function description(): string
    {
        return 'A fixture domain whose binders link to sheets, cards and tabs, three shareable types, and to memos, which are not linkable for sharing.';
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
            new ShareRecordRegistration('binders.binder', Binder::class, BinderShareProvider::class, []),
            new ShareRecordRegistration(
'binders.sheet',
 BinderPage::class,
 BinderShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordRegistration(
'binders.card',
 BinderPage::class,
 BinderShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordRegistration(
'binders.tab',
 BinderPage::class,
 BinderShareProvider::class,
 ['share-linked-record'],
),
            new ShareRecordRegistration('binders.memo', BinderPage::class, BinderShareProvider::class, []),
        ];
    }
}
