<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Accounts\AccountList;
use App\Http\Pages\Accounts\AccountsIndex;
use App\Http\Requests\Profiles\AccountsPageRequest;
use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;

final readonly class AccountsWindowResolver implements PageResolver
{
    private const int PAGE_LIMIT = 25;

    public function __construct(
        private AccountList $accounts,
        private AccountsPageRequest $request,
        private AccountsIndex $layout,
    ) {}

    public function read(): DeclaredLayoutData
    {
        $chosen = $this->request->chosenAccount();
        $page = $this->accounts->page(
            $this->request->page(),
            self::PAGE_LIMIT,
            $chosen,
            $this->request->usagePage(),
            $this->request->isAdding(),
        );

        return $this->layout->of($page, $chosen);
    }
}
