package com.alex.tv

import android.content.Intent
import android.webkit.JavascriptInterface
import android.widget.Toast

/**
 * JavaScript interface exposed to the WebView as `window.NativeBridge`.
 *
 * Call from JS:
 *   NativeBridge.playVideo("file:///storage/movies/Echoes of Mars.mkv")
 *   NativeBridge.showToast("Hello from native!")
 *   NativeBridge.getDeviceInfo()
 */
class TvBridge(private val activity: MainActivity) {

    @JavascriptInterface
    fun playVideo(uri: String, title: String) {
        val intent = Intent(activity, PlayerActivity::class.java).apply {
            putExtra(PlayerActivity.EXTRA_URI, uri)
            putExtra(PlayerActivity.EXTRA_TITLE, title)
        }
        activity.startActivity(intent)
    }

    @JavascriptInterface
    fun showToast(message: String) {
        activity.runOnUiThread {
            Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
        }
    }

    @JavascriptInterface
    fun getDeviceInfo(): String {
        return """{"model":"${android.os.Build.MODEL}","sdk":${android.os.Build.VERSION.SDK_INT},"manufacturer":"${android.os.Build.MANUFACTURER}"}"""
    }

    @JavascriptInterface
    fun exitApp() {
        activity.runOnUiThread {
            activity.finishAffinity()
        }
    }
}
