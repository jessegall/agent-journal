<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Accounts\Data\AccountNoticesData;
use App\Declarations\SlotContext;
use App\Models\Accounts\AccountNotice;
use App\Navigation\Contracts\SectionResolver;

/**
 * The bar's account notices: open notices the owner can read, none for anyone else.
 */
final readonly class AccountNoticesSection implements SectionResolver
{
    public function read(SlotContext $context): AccountNoticesData
    {
        return AccountNoticesData::from(['notices' => AccountNotice::findOpenNotices()]);
    }
}
