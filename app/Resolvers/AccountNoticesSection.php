<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Navigation\SectionResolver;
use App\Data\Profiles\AccountNoticesData;
use App\Declarations\SlotContext;
use App\Models\Accounts\AccountNotice;

/**
 * The bar's account notices: open notices the owner can read, none for anyone else.
 */
final readonly class AccountNoticesSection implements SectionResolver
{
    public function read(SlotContext $context): AccountNoticesData
    {
        return AccountNoticesData::from(['notices' => AccountNotice::openNotices()]);
    }
}
