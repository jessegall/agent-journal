<?php

declare(strict_types=1);

namespace App\Domain\Web\Http\Middleware;

use App\Domain\Access\Contracts\ViewerReader;
use App\Domain\Web\Data\SharedData;
use App\Domain\Web\Data\ViewerData;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * The one Inertia middleware: the root view, the asset version and the shared Data every page receives.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        #[Config('app.name')] private readonly string $appName,
        private readonly ViewerReader $viewers,
    ) {}

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $viewer = $this->viewers->viewer();
        $shared = $viewer === null
            ? SharedData::from(['name' => $this->appName])
            : SharedData::from(['name' => $this->appName, 'viewer' => ViewerData::from($viewer)]);

        return [
            ...parent::share($request),
            ...$shared->toArray(),
        ];
    }
}
