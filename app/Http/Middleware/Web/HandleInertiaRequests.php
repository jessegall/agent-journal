<?php

declare(strict_types=1);

namespace App\Http\Middleware\Web;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorContext;
use App\Actors\Values\ChatMemberAuthority;
use App\Contracts\CommandRefusal;
use App\Sharing\Contracts\SharePolicy;
use App\Web\Contracts\CurrentUserResolver;
use App\Web\Contracts\InstalledVersion;
use App\Web\Contracts\NavigationRecords;
use App\Web\Data\CurrentUserData;
use App\Web\Data\SharedData;
use Illuminate\Container\Attributes\Config;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Inertia\ResponseFactory;

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
        #[Config('app.name')]
        private readonly string $appName,
        private readonly CurrentUserResolver $users,
        private readonly NavigationRecords $navigation,
        private readonly ResponseFactory $inertia,
        private readonly SharePolicy $sharing,
        private readonly InstalledVersion $version,
        private readonly CurrentActor $actors,
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
        $user = $this->users->currentUser();

        if ($user->isEmpty()) {
            return [
                ...parent::share($request),
                ...SharedData::from(['name' => $this->appName, 'version' => $this->version->label()])->toArray(),
            ];
        }

        return [
            ...parent::share($request),
            ...SharedData::from(
                [
                    'name' => $this->appName,
                    'version' => $this->version->label(),
                    'currentUser' => CurrentUserData::from($user->get()),
                    'canShare' => $this->sharing->mayManage(ActorContext::forUser($user->get()->id)),
                    ...$this->refusalCodeOf($request),
                ],
            )->toArray(),
            // The navigation the signed-in user may see, and its counts after the page, so a slow count never holds it
            // up.
            'navigation' => fn () => $this->navigation->tree($request),
            // A chat member is shown no journal counts: it sees only the chats it is in.
            'navigationCounts' => $this->isChatMember()
                ? []
                : $this->inertia->defer(fn () => $this->navigation->counts(), 'navigation-counts'),
        ];
    }

    private function isChatMember(): bool
    {
        return $this->actors->hasActor() && $this->actors->authority() instanceof ChatMemberAuthority;
    }

    /**
     * The stable code of the refusal the last form was answered with, when it was refused.
     *
     * @return array{refusalCode?: string}
     */
    private function refusalCodeOf(Request $request): array
    {
        $code = $request->session()->get(CommandRefusal::CODE_FLASH_KEY);

        return is_string($code) ? ['refusalCode' => $code] : [];
    }
}
