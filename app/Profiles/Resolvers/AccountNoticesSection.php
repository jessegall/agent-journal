<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Http\Data\Profiles\AccountNoticeData;
use App\Http\Data\Profiles\AccountNoticesData;
use App\Profiles\Models\AccountNotice;
use App\Ui\Contracts\SectionResolver;
use App\Ui\Declarations\SlotContext;

/**
 * The bar's account notices: open notices the owner can read, none for anyone else.
 */
final readonly class AccountNoticesSection implements SectionResolver
{
    public function read(SlotContext $context): AccountNoticesData
    {
        return AccountNoticesData::from(['notices' => array_map(AccountNoticeData::fromNotice(...), AccountNotice::openNotices())]);
    }
}
