<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Accounts\AccountOwnerCheck;
use App\Web\Attributes\Paged;
use App\Web\Attributes\PermissionGated;
use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

#[Paged('page', size: 25), PermissionGated(AccountOwnerCheck::class)]
final class AccountsPageData extends LayoutPageData
{
    /** @use Buildable<AccountsPageDataFields> */
    use Buildable;

    protected const string FIELDS = AccountsPageDataFields::class;
}
