<?php

declare(strict_types=1);

namespace App\Accounts\Data;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

final class AccountListPageData extends Data
{
    /** @use Buildable<AccountListPageDataFields> */
    use Buildable;

    protected const string FIELDS = AccountListPageDataFields::class;

    /** @param list<AccountRowData> $rows */
    public function __construct(
        #[DataCollectionOf(AccountRowData::class)]
        public readonly array $rows,
        public readonly int $total,
        public readonly int $page,
        public readonly int $lastPage,
        public readonly AccountRowData|null $selected,
        public readonly int $usagePage,
        public readonly int $usageLastPage,
        public readonly AccountListData|null $addForm,
    ) {}
}
