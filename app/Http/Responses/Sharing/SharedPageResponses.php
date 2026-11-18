<?php

declare(strict_types=1);

namespace App\Http\Responses\Sharing;

use App\Contracts\CommandRefusal;
use App\Sharing\Exceptions\ShareReadLimited;
use App\Sharing\Support\SharedPage;
use App\Text\Support\MarkdownText;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\View;
use Throwable;

/**
 * The share listener's answers, all from fixed templates: a shared page, a neutral not-available page for a denial
 * or a refusal, and a neutral failure page for anything else. None of them names the link, the token or the cause.
 */
final readonly class SharedPageResponses
{
    public function page(SharedPage $page): Response
    {
        if (! $page->allowed) {
            return self::unavailable();
        }

        return new Response(View::make('sharing.page', ['page' => $page, 'bodyHtml' => MarkdownText::body($page->body)->toSafeHtml()])->render(), 200);
    }

    /**
     * Too many reads wait a minute, a refusal or a denial is not available, and any other failure, such as a database
     * or audit failure, is a failure.
     */
    public static function forFailure(Throwable $failure): Response
    {
        return match (true) {
            $failure instanceof ShareReadLimited => self::refused(429),
            $failure instanceof CommandRefusal => self::unavailable(),
            default => new Response(View::make('sharing.failed')->render(), 503),
        };
    }

    public static function refused(int $status): Response
    {
        return new Response(View::make('sharing.unavailable')->render(), $status);
    }

    private static function unavailable(): Response
    {
        return self::refused(404);
    }
}
