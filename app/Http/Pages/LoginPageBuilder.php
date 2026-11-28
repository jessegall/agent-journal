<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Accounts\Data\LoginInput;
use App\Pages\LoginPage;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Container\Attributes\Config;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\Request;

final readonly class LoginPageBuilder implements PageBuilder
{
    public function __construct(
        private Application $app,
        #[Config('journal.web.local_sign_in.email')]
        private string $localEmail,
        #[Config('journal.web.local_sign_in.password')]
        private string $localPassword,
    ) {}

    public function build(Request $visit): LoginPage
    {
        $input = $this->app->isLocal()
            ? LoginInput::filledWith($this->localEmail, $this->localPassword)
            : LoginInput::blank();

        return LoginPage::build()->input($input)->finish();
    }
}
