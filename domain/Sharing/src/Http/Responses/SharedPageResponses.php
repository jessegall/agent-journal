<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Responses;

use App\Contracts\Bus\CommandRefusal;
use App\Support\MarkdownText;
use Domain\Sharing\Exceptions\ShareReadLimited;
use Domain\Sharing\Support\SharedPage;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * The share listener's answers, all from fixed templates: a shared page, a neutral not-available page for a denial
 * or a refusal, and a neutral failure page for anything else. None of them names the link, the token or the cause.
 */
final readonly class SharedPageResponses
{
    public function __construct(
        private SharingAssets $assets,
        private Factory $views,
    ) {}

    public function page(SharedPage $page): Response
    {
        if (! $page->isAllowed) {
            return $this->unavailable();
        }

        $view = $this->views->make('sharing.page', [
            'page' => $page,
            'bodyHtml' => MarkdownText::publicHtmlOf($page->body),
            'stylesheet' => $this->assets->stylesheet(),
        ]);

        return new Response($view->render(), 200);
    }

    /**
     * Too many reads wait a minute, a refusal or a denial is not available, and any other failure, such as a database
     * or audit failure, is a failure.
     */
    public function forFailure(Throwable $failure): Response
    {
        return match (true) {
            $failure instanceof ShareReadLimited => $this->refused(429),
            $failure instanceof HttpExceptionInterface => $this->refused($failure->getStatusCode()),
            $failure instanceof CommandRefusal => $this->unavailable(),
            default => new Response($this->views->make('sharing.failed')->render(), 503),
        };
    }

    public function refused(int $status): Response
    {
        return new Response($this->views->make('sharing.unavailable')->render(), $status);
    }

    private function unavailable(): Response
    {
        return $this->refused(404);
    }
}
