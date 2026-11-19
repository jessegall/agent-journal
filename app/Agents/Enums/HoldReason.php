<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why a runtime or a request waits instead of going on (doc 40, section 21); None when nothing holds it.
 */
#[TypeScript]
enum HoldReason: string
{
    case None = 'none';
    case Interrupted = 'interrupted';
    case Compacting = 'compacting';
    case HumanInput = 'human_input';
    case DriverInput = 'driver_input';
    case PermissionRequired = 'permission_required';
    case TrustRequired = 'trust_required';
    case OnboardingRequired = 'onboarding_required';
    case LoginRequired = 'login_required';
    case UpdateRequired = 'update_required';
    case UsageLimited = 'usage_limited';
    case UnknownScreen = 'unknown_screen';
    case ScreenUnreadable = 'screen_unreadable';
    case NeedsAttention = 'needs_attention';
    case NavigationNeeded = 'navigation_needed';

    /**
     * Whether only a person can clear the hold: a screen the program shows that the journal never answers alone.
     */
    public function needsAPerson(): bool
    {
        return match ($this) {
            self::PermissionRequired, self::TrustRequired, self::OnboardingRequired, self::LoginRequired,
            self::UpdateRequired, self::UnknownScreen, self::ScreenUnreadable, self::NeedsAttention,
            self::NavigationNeeded => true,
            self::None,
            self::Interrupted,
            self::Compacting,
            self::HumanInput,
            self::DriverInput,
            self::UsageLimited => false,
        };
    }
}
