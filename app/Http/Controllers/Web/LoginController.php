<?php

declare(strict_types=1);

namespace App\Http\Controllers\Web;

use App\CorePages;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

final readonly class LoginController
{
    public function __construct(private ResponseFactory $inertia, private PageFactory $pages) {}

    public function __invoke(Request $request): Response
    {
        $login = CorePages::login();

        return $this->inertia->render(
            pathinfo($login->component, PATHINFO_FILENAME),
            ['page' => fn () => $this->pages->create($login->type, $request)],
        );
    }
}
