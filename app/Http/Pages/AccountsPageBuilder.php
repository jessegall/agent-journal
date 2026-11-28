<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Accounts\AccountList;
use App\Http\Pages\Accounts\AccountsIndex;
use App\Http\Requests\Profiles\AccountsInput;
use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Creation\SurfaceContexts;
use App\Web\Creation\SurfacePayload;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

final readonly class AccountsPageBuilder implements PageBuilder
{
    public function __construct(
        private AccountList $accounts,
        private AccountsIndex $layout,
        private SurfaceContexts $contexts,
        private SurfaceAttributeMap $policies,
        private Redirector $redirects,
    ) {}

    public function build(Request $visit): AccountsPageData
    {
        $context = $this->contexts->forVisit($visit);
        $input = AccountsInput::validateAndCreate(new SurfacePayload($context, []));
        $policy = $this->policies->forPage(AccountsPageData::class);
        $chosen = $input->account ?? '';

        $page = $this->accounts->page(
            $input->page,
            $policy->pageSize(),
            $chosen,
            $input->usagePage,
            $input->isAdding,
        );

        if ($page->page !== $input->page) {
            throw new HttpResponseException($this->redirects->to($visit->fullUrlWithQuery(['page' => $page->page])));
        }

        return AccountsPageData::build()->shown($this->layout->of($page, $chosen))->finish();
    }
}
