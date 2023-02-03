### Tính năng popover

# Input : khi user hover vào tên tài khoản hoặc vào ngôn ngữ thì sẽ hiện ra 1 popover ( giống dropdown nhưng chỉ hover vào)

Vậy nếu dùng react thuần thì ta sẽ làm như thế nào ?

> Tips : Nếu dùng react thuần thì ta sẽ dễ gặp lỗi là cái popover sẽ bị đè z-index bởi các component khác => dùng react.portal

```js - portal tạo modal
function createPortalWrapper() {
  const element = document.createElement('div')
  element.id = 'portal-wrapper'

  // khởi tạo thẻ div là element và đặt id cho nó
  return element
  //*  và khi gọi hàm này thì hàm sẽ trả ra thẻ div đó
}
const wrapperElement = createPortalWrapper()

const PortalPractice = ({
  containerClassName = '',
  containerStyle = {},
  bodyClassName = '',
  bodyStyle = {},
  visible = false,
  children,
  onClose = () => {}
}) => {
  useEffect(() => {
    document.body.appendChild(wrapperElement)
  }, [])

  const content = (
    <div className={`fixed inset-0 z-[9999]  ${containerClassName} `} style={containerStyle}>
      <div className={'overlay bg-black opacity-20 absolute inset-0'} onClick={onClose}></div>
      <div className={`content relative z-10 ${bodyClassName}`} style={bodyStyle}>
        {children}
      </div>
    </div>
  )
  return createPortal(content, wrapperElement)
}
```

> Vậy để tiết kiệm thời gian thì mình sẽ dùng thư viện gì
>
> > Mình sẽ dùng 2 thư viện là floating-ui và framer-motion
> >
> > > floating-ui là giống như tạo portal, sẽ cùng cấp với thư mục root

```js - floatingUI syntax
function Popover() {
  const [open, setOpen] = useState(initialOpen || false)
  const arrowRef = useRef < HTMLElement > null
  // state để handle open và refArrow cho cái mũi tên của phần popover

  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [arrow({ element: arrowRef }), offset(6), shift()],
    placement: placement
  })
  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }
  return (
    <>
      <Element
        ref={refs.setReference}
        onMouseEnter={showPopover}
        onMouseLeave={hidePopover}
        className='flex items-center py-1 cursor-pointer hover:text-gray-300'
      >
        {children}
        <FloatingPortal id={id}>
          <AnimatePresence>
            {open && (
              <motion.div
                ref={refs.setFloating}
                style={{
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                  width: 'max-content',
                  transformOrigin: `${middlewareData.arrow?.x}px top`
                }}
                initial={{ opacity: 0, transform: 'scale(0)' }}
                animate={{ opacity: 1, transform: 'scale(1)' }}
                exit={{ opacity: 0, transform: 'scale(0)' }}
                transition={{ duration: 0.2 }}
              >
                <span
                  ref={arrowRef}
                  className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-t-transparent border-b-white'
                  style={{
                    left: middlewareData.arrow?.x,
                    top: middlewareData.arrow?.y
                  }}
                ></span>
                {renderPopover}
              </motion.div>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </Element>
    </>
  )
}
```
