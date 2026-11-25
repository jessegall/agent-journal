<?php

declare(strict_types=1);

namespace Tests\Fixtures\PagePropsOwners;

use App\Http\Middleware\Web\HandleInertiaRequests;
use Illuminate\Http\Request;

/**
 * The Inertia middleware with one shared prop that neither the app context, a page nor a loader owns.
 */
final class SharingAnUnownedProp extends HandleInertiaRequests
{
    public const string UNOWNED = 'currentUser';

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [...parent::share($request), self::UNOWNED => 'Ada'];
    }
}
