<?php

declare(strict_types=1);

namespace App\Core\Web\Http\Controllers;

use App\Core\Web\Data\LoginInput;
use App\Core\Web\Pages\LoginPage;
use Illuminate\Contracts\Config\Repository;
use Illuminate\Contracts\Foundation\Application;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Shows the sign-in page, filled with the local account in local development; Fortify's own login and logout actions
 * handle the form.
 */
final readonly class LoginController
{
    public function __construct(
        private ResponseFactory $inertia,
        private Application $app,
        private Repository $config,
    ) {}

    public function __invoke(): Response
    {
        return $this->inertia->render(LoginPage::COMPONENT, ['page' => fn () => LoginPage::startingWith($this->startingInput())]);
    }

    /**
     * Empty, except in local development, where the configured local account fills the form.
     */
    private function startingInput(): LoginInput
    {
        if (! $this->app->isLocal()) {
            return LoginInput::blank();
        }

        return LoginInput::filledWith($this->config->string('web.local_sign_in.email'), $this->config->string('web.local_sign_in.password'));
    }
}
