<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Controllers;

use App\Domain\Web\Pages\LoginPage;
use Inertia\Response;
use Inertia\ResponseFactory;

/**
 * Shows the sign-in page; Fortify's own login and logout actions handle the form.
 */
final readonly class LoginController
{
    public function __construct(private ResponseFactory $inertia) {}

    public function __invoke(): Response
    {
        return $this->inertia->render(LoginPage::COMPONENT, ['page' => fn () => LoginPage::blank()]);
    }
}
